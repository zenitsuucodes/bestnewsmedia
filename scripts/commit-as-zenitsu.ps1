param(
  [Parameter(Mandatory = $true, ValueFromRemainingArguments = $true)]
  [string[]]$Args
)

git -c user.name="Zenitsu" `
    -c user.email="310690348+zenitsuucodes@users.noreply.github.com" `
    commit @Args
