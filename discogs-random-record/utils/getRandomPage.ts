/**
 * From your amount of pages get a random number
 */
export default (min = 1, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
