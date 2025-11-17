const includeHiddenBacklinksValue =
  typeof process !== 'undefined'
    ? process.env.NEXT_PUBLIC_INCLUDE_HIDDEN_BACKLINKS ?? process.env.INCLUDE_HIDDEN_BACKLINKS
    : 'true';

export const includeHiddenBacklinks = (includeHiddenBacklinksValue ?? 'true') !== 'false';
export const teknavUrl = 'https://teknav.ir';
