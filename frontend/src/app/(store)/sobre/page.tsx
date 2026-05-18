import { apiServer } from '@/lib/api';

interface StoreInfoResponse {
  name: string;
  aboutTitle: string;
  aboutContent: string;
}

export default async function SobrePage() {
  let storeInfo: StoreInfoResponse | null = null;
  try {
    storeInfo = await apiServer<StoreInfoResponse>('/store-info');
  } catch {
    // API not ready
  }

  return (
    <div>
      {/* Hero section */}
      <section className="bg-white py-20 md:py-28">
        <div className="luxury-container text-center">
          <p className="luxury-subheading text-accent">Nossa História</p>
          <h1 className="mt-4 font-display text-4xl font-normal text-primary md:text-5xl">
            {storeInfo?.aboutTitle ?? 'Sobre a Arcanjus'}
          </h1>
          <div className="luxury-divider" />
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="luxury-container">
          <div className="mx-auto max-w-2xl space-y-6">
            {storeInfo?.aboutContent.split('\n').map((paragraph, i) => (
              <p key={i} className="text-sm leading-[1.8] text-primary-light">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20 md:py-28">
        <div className="luxury-container">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-brand-200">
                <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <h3 className="luxury-subheading">Qualidade Premium</h3>
              <p className="mt-3 text-sm text-primary-light">
                Tecidos selecionados dos melhores fornecedores, com foco em durabilidade e conforto.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-brand-200">
                <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <h3 className="luxury-subheading">Feito com Cuidado</h3>
              <p className="mt-3 text-sm text-primary-light">
                Cada peça passa por rigoroso controle de qualidade antes de chegar até você.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-brand-200">
                <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="luxury-subheading">Estilo Atemporal</h3>
              <p className="mt-3 text-sm text-primary-light">
                Design que transcende tendências passageiras — elegância que permanece.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
