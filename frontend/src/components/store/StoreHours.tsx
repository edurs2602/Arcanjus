interface Hours {
  [key: string]: { open: string; close: string } | null;
}

interface StoreHoursProps {
  hours: Hours;
}

const dayLabels: Record<string, string> = {
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function StoreHours({ hours }: StoreHoursProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-light">
        Horário de Funcionamento
      </h3>
      <dl className="space-y-1">
        {dayOrder.map((day) => {
          const schedule = hours[day];
          return (
            <div key={day} className="flex justify-between text-sm">
              <dt className="text-primary-light">{dayLabels[day]}</dt>
              <dd className="font-medium text-primary">
                {schedule ? `${schedule.open} – ${schedule.close}` : 'Fechado'}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
