import { suffle } from '../core/utils';

export const DIFICULTIES = [{
    ballsRange: {min: 2, max: 5},
    ballsSpamRate: suffle([3000, 4000, 5000]),
    velocity: suffle([2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.8])
}, {
    ballsRange: {min: 3, max: 6},
    ballsSpamRate: suffle([3000, 4000, 5000]),
    velocity: suffle([2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.8, 3])
}, {
    ballsRange: {min: 4, max: 7},
    ballsSpamRate: suffle([3000, 3000, 4000, 5000]),
    velocity: suffle([2, 2.1, 2.2, 2.3, 2.4, 2.5, 3])
}, {
    ballsRange: {min: 4, max: 8},
    ballsSpamRate: suffle([3000, 3000, 4000, 5000]),
    velocity: suffle([2, 2.1, 2.2, 2.1, 2.3, 2.4, 2.5, 2.8])
}, {
    ballsRange: {min: 4, max: 8},
    ballsSpamRate: suffle([3000, 3000, 4000, 5000]),
    velocity: suffle([2, 2.1, 2.2, 2.1, 2.3, 2.4, 2.5, 2.8, 3])
}, {
    ballsRange: {min: 4, max: 8},
    ballsSpamRate: suffle([3000, 3000, 4000, 5000, 5000]),
    velocity: suffle([2, 2.1, 2.2, 2.3, 2.4, 2.5, 3, 3.1])
}, {
    ballsRange: {min: 2, max: 9},
    ballsSpamRate: suffle([3000, 4000, 5000, 5000]),
    velocity: suffle([2, 2.1, 2.2, 2.3, 2.4, 2.5, 3, 3.2, 3.3])
}, {
    ballsRange: {min: 5, max: 10},
    ballsSpamRate: suffle([3000, 4000, 5000, 5000, 7000]),
    velocity: suffle([2, 2.1, 2.2, 2.3, 2.4, 2.5, 3, 3.2, 3.3])
}, {
    ballsRange: {min: 6, max: 10},
    ballsSpamRate: suffle([4000, 5000, 8000]),
    velocity: suffle([2, 2.1, 2.2, 2.3, 2.4, 2.5, 3, 3.1, 3.2, 3.3])
}, {
    ballsRange: {min: 7, max: 10},
    ballsSpamRate: suffle([4000, 5000, 8000]),
    velocity: suffle([2, 2.1, 2.2, 2.3, 2.4, 2.5, 3, 3.1, 3.2, 3.3])
}];
