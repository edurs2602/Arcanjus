'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface FilterSidebarProps {
  categories: string[];
  colors: string[];
  sizes: string[];
}

export function FilterSidebar({ categories, colors, sizes }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get('category') ?? '';
  const activeColor = searchParams.get('color') ?? '';
  const activeSize = searchParams.get('size') ?? '';

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`/camisas?${params.toString()}`);
  }

  function clearFilters() {
    router.push('/camisas');
  }

  const hasActiveFilters = activeCategory || activeColor || activeSize;

  return (
    <aside className="w-full space-y-8 md:w-56 lg:w-64">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-medium uppercase tracking-widest-xl text-primary">Filtrar</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-[10px] uppercase tracking-widest-xl text-primary-light transition-colors hover:text-primary"
          >
            Limpar
          </button>
        )}
      </div>

      <div className="h-px bg-brand-200" />

      <FilterGroup
        label="Categoria"
        options={categories}
        active={activeCategory}
        onChange={(v) => updateFilter('category', v)}
      />

      <FilterGroup
        label="Cor"
        options={colors}
        active={activeColor}
        onChange={(v) => updateFilter('color', v)}
      />

      <FilterGroup
        label="Tamanho"
        options={sizes}
        active={activeSize}
        onChange={(v) => updateFilter('size', v)}
      />
    </aside>
  );
}

function FilterGroup({
  label,
  options,
  active,
  onChange,
}: {
  label: string;
  options: string[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <h3 className="mb-4 text-[10px] font-medium uppercase tracking-widest-xl text-primary-light">{label}</h3>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(active === option ? '' : option)}
            className={`text-left text-sm transition-colors duration-200 ${
              active === option
                ? 'font-medium text-primary'
                : 'text-primary-light hover:text-primary'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className={`inline-block h-2 w-2 rounded-full border transition-colors ${
                active === option
                  ? 'border-accent bg-accent'
                  : 'border-brand-300 bg-transparent'
              }`} />
              <span className="capitalize">{option}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
