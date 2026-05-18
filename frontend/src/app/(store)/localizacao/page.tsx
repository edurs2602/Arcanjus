import { apiServer } from '@/lib/api';
import { MapView } from '@/components/store/MapView';
import { StoreHours } from '@/components/store/StoreHours';
import { StoreContact } from '@/components/store/StoreContact';

interface StoreInfoResponse {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  latitude: number;
  longitude: number;
  hours: Record<string, { open: string; close: string } | null>;
}

export default async function LocalizacaoPage() {
  let storeInfo: StoreInfoResponse | null = null;
  try {
    storeInfo = await apiServer<StoreInfoResponse>('/store-info');
  } catch {
    // API not ready
  }

  if (!storeInfo) {
    return (
      <div className="luxury-container py-20 text-center">
        <p className="text-primary-light">Informações indisponíveis no momento.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-white py-20 md:py-28">
        <div className="luxury-container text-center">
          <p className="luxury-subheading text-accent">Visite-nos</p>
          <h1 className="mt-4 font-display text-4xl font-normal text-primary md:text-5xl">
            Nosso Atelier
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-primary-light">
            Venha conhecer nossa coleção pessoalmente e experimentar o atendimento exclusivo que só um espaço físico proporciona.
          </p>
          <div className="luxury-divider" />
        </div>
      </section>

      {/* Map + Info */}
      <section className="py-12 md:py-16">
        <div className="luxury-container">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
            {/* Info column */}
            <div className="space-y-10 lg:col-span-2">
              <StoreContact
                address={storeInfo.address}
                city={storeInfo.city}
                state={storeInfo.state}
                zipCode={storeInfo.zipCode}
                phone={storeInfo.phone}
              />
              <div className="h-px bg-brand-200" />
              <StoreHours hours={storeInfo.hours} />
            </div>

            {/* Map column */}
            <div className="lg:col-span-3">
              <MapView
                latitude={storeInfo.latitude}
                longitude={storeInfo.longitude}
                name={storeInfo.name}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
