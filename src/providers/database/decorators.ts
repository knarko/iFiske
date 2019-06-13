export function DBMethod(_target, _pkey, descriptor) {
  const old = descriptor.value;
  descriptor.value = async function(...args) {
    await this.ready;
    return old.apply(this, args);
  };
  return descriptor;
}
