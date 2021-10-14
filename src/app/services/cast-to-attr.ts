export function CastToAttribute(): PropertyDecorator {
  return (target: any, propertyKey: string) => {
    let key = Symbol(propertyKey);
    Object.defineProperty(target, propertyKey, {
      get: function (): string | null {
        return this[key] ? '' : null;
      },
      set: function (value: boolean) {
        this[key] = value;
      },
    });
  };
}
