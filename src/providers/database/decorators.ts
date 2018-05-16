export function DBMethod(target, pkey, descriptor) {
  const old = descriptor.value;
  descriptor.value = async function(...args) {
    await this.ready;
    return old.apply(this, args);
  };
  return descriptor;
}
