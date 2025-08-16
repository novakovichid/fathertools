import test from 'node:test';
import assert from 'node:assert/strict';
import { getAgeString } from '../child-tracker.js';

function withMockedDate(nowDate, fn) {
  const RealDate = Date;
  class MockDate extends RealDate {
    constructor(...args) {
      if (args.length) return super(...args);
      return new RealDate(nowDate);
    }
    static now() {
      return new RealDate(nowDate).getTime();
    }
  }
  global.Date = MockDate;
  try {
    fn();
  } finally {
    global.Date = RealDate;
  }
}

test('calculates age for regular date', () => {
  withMockedDate('2024-06-15', () => {
    const result = getAgeString('2023-04-10');
    assert.equal(result, '1 г. 2 мес. 5 дн. (всего 432 дней)');
  });
});

test('handles birth on Feb 29', () => {
  withMockedDate('2021-03-01', () => {
    const result = getAgeString('2020-02-29');
    assert.equal(result, '1 г. 0 дн. (всего 366 дней)');
  });
});

test('future birth date returns zero age', () => {
  withMockedDate('2024-06-15', () => {
    const result = getAgeString('2024-07-01');
    assert.equal(result, '0 дн. (всего 0 дней)');
  });
});
