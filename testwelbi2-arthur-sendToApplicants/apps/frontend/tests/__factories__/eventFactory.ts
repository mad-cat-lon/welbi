import { faker } from '@faker-js/faker'

export function buildEvent(overrides = {}) {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    startTime: faker.date.future().toISOString(),
    endTime: faker.date.future().toISOString(),
    status: faker.helpers.arrayElement(['scheduled', 'cancelled', 'completed']),
    currentParticipants: faker.number.int({ min: 0, max: 10 }),
    maxParticipants: faker.number.int({ min: 10, max: 20 }),
    ...overrides,
  }
}