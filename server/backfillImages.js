import { loadArticleCatalog } from './articleCatalog.js';
import { attachImagesToArticles, initImageSources } from './imageSearch.js';
import { getUsedSourceUrls, hasStoredImage } from './imageStore.js';

async function main() {
  console.log('Loading article catalog…');
  await initImageSources(await getUsedSourceUrls());

  const { all } = await loadArticleCatalog();
  const missing = [];

  for (const article of all) {
    if (article.image) continue;
    if (await hasStoredImage(article.id)) {
      article.image = `/api/img/a/${article.id}`;
      continue;
    }
    missing.push(article);
  }

  console.log(`Articles: ${all.length}, already have images: ${all.length - missing.length}, to fetch: ${missing.length}`);
  if (!missing.length) {
    console.log('Nothing to backfill.');
    return;
  }

  const batchSize = 4;
  const startWithImages = all.filter((a) => a.image).length;

  for (let i = 0; i < missing.length; i += batchSize) {
    const batch = missing.slice(i, i + batchSize);
    await attachImagesToArticles(batch, batchSize);
    const processed = Math.min(i + batchSize, missing.length);
    const added = all.filter((a) => a.image).length - startWithImages;
    console.log(`Progress: ${processed}/${missing.length} processed (${added} new images)`);
  }

  const stillMissing = missing.filter((a) => !a.image).length;
  const added = all.filter((a) => a.image).length - startWithImages;
  console.log(`Backfill complete. ${added} images added, ${stillMissing} still without images.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
