import buyNow from './buyNow';
import comparePrice from './comparePrice';
import Provider from '../Provider';
import quickSell from './quickSell';
import storeInClub from './storeInClub';
import { log } from '../../utils/logger';

export default function getFIFA18Provider(): Provider {
    return {
        buyNow: buyNow,
        comparePrice: comparePrice,
        quickSell: quickSell,
        storeInClub: storeInClub
    };
}
