export function formatPrice(price: number, priceType: string, customDescription?: string) {
  const formattedPrice = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    minimumFractionDigits: 0,
  }).format(price)

  switch (priceType) {
    case "fixed":
      return `${formattedPrice} (Precio fijo)`
    case "hourly":
      return `${formattedPrice}/hora`
    case "event":
      return `${formattedPrice}/evento`
    case "custom":
      return `${formattedPrice} (${customDescription || "Precio personalizado"})`
    default:
      return formattedPrice
  }
}