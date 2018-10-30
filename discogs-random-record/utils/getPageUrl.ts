/**
 * Returns the page url with a randomized page
 */
export default (url: string, pageNum: number) => url.replace(/&page=\d+$/g, `&page=${pageNum}`);
