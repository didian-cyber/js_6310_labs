import { BookingStateMachine } from '../src/utils/index.js';

describe('BookingStateMachine', () => {
  let stateMachine;

  beforeEach(() => {
    stateMachine = new BookingStateMachine();
  });

  test('should initialize with idle state', () => {
    expect(stateMachine.getState(123)).toBe('idle');
  });

  test('should set and get state', () => {
    stateMachine.setState(123, 'selecting_service');
    expect(stateMachine.getState(123)).toBe('selecting_service');
  });

  test('should update user data', () => {
    stateMachine.updateData(123, { serviceId: 'test' });
    expect(stateMachine.getUserData(123).serviceId).toBe('test');
  });

  test('should reset state and data', () => {
    stateMachine.setState(123, 'selecting_service');
    stateMachine.updateData(123, { serviceId: 'test' });
    
    stateMachine.resetState(123);
    
    expect(stateMachine.getState(123)).toBe('idle');
    expect(stateMachine.getUserData(123)).toEqual({});
  });
});