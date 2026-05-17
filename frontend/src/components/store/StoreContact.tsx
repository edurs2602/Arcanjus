interface StoreContactProps {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export function StoreContact({ address, city, state, zipCode, phone }: StoreContactProps) {
  const fullAddress = `${address}, ${city} - ${state}, ${zipCode}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-light">
          Endereço
        </h3>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block text-primary hover:text-accent"
        >
          {address}
          <br />
          {city} - {state}, {zipCode}
        </a>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-light">
          Telefone
        </h3>
        <a href={`tel:${phone.replace(/\D/g, '')}`} className="mt-1 block text-primary hover:text-accent">
          {phone}
        </a>
      </div>
    </div>
  );
}
