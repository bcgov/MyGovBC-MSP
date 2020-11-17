export class BaseDto {
  // Attach all primitives from the dto to the entity (or vice-versa)
  transferPrimitives(src, target) {
    for (const key in src) {
      const val = src[key];

      if (
        typeof val === 'string' ||
        typeof val === 'number' ||
        typeof val === 'boolean'
      ) {
        target[key] = src[key];
      }
    }
  }
}
