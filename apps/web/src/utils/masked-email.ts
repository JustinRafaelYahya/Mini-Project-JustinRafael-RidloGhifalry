export default function MaskedEmail(email: string) {
  if (!email) return null;

  const [localPart, domainPart] = email.split('@');
  const maskedLocalPart =
    localPart.length > 2
      ? '*'.repeat(localPart.length - 2) + localPart.slice(-2)
      : localPart;

  return maskedLocalPart + '@' + domainPart;
}
