export function buildWhatsAppLink({
  phoneNumber = "+94775105848",
  message,
}: {
  phoneNumber?: string;
  message: string;
}): string {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export function getItineraryWhatsAppMessage(title: string, duration: string, price: string): string {
  return `Hi Ceylon Travels! I am interested in the ${duration} "${title}" tour (starting from ${price}). Could you please share details and help customize this itinerary?`;
}

export function getDestinationWhatsAppMessage(name: string, region: string): string {
  return `Hi Ceylon Travels! I am planning a trip to ${name} (${region}). Could you please help customize a tour for me?`;
}

export function getGeneralWhatsAppMessage(): string {
  return `Hi Ceylon Travels! I would like to inquire about planning a custom travel package to Sri Lanka.`;
}
