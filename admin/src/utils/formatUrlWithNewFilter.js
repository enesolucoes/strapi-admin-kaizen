function formatUrlWithNewFilter(queryColumn, queryType, queryValue, url = '') {  
  if (!url) return;

  const isFirstParameter = url.indexOf('?') === -1;
  const firstParameterFormat = isFirstParameter ? '?' : '&';

  const lastIndexFilter = url.lastIndexOf('filters');

  if (lastIndexFilter === -1) {
    return `${firstParameterFormat}filters[$and][0]${queryColumn}[${queryType}]=${queryValue}`;
  }

  const lastFilterDetails = url.substring(lastIndexFilter);
  const lastFilterInArray = lastFilterDetails.replace(/(\[)|(\])/g, '-').split('--');

  const position = Number(lastFilterInArray[1] || 0);

  if (isNaN(position)) return;

  return `&filters[$and][${position + 1}]${queryColumn}[${queryType}]=${queryValue}`;
}

export default formatUrlWithNewFilter;