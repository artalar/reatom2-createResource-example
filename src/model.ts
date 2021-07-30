import { createAtom } from "@reatom/core";
import { createResource } from "@reatom/core/experiments";

type ImageData = { image_id: string; title: string };

export const imagesAtom = createResource(
  ($, state = new Array<ImageData>()) => state,
  (page: number = 1) =>
    fetch(
      `https://api.artic.edu/api/v1/artworks?fields=image_id,title&page=${page}&limit=${10}`
    )
      .then((r) => r.json())
      .then(({ data }: { data: Array<ImageData> }) =>
        data.filter((el) => el.image_id)
      ),
  `images`
);

export const pageAtom = createAtom(
  {
    next: () => null,
    prev: () => null
  },
  ($, state = 1) => {
    $({
      next: () => (state += 1),
      prev: () => (state = Math.max(1, state - 1))
    });

    $.effect((dispatch) => dispatch(imagesAtom.fetch(state)));

    return state;
  },
  {
    id: `paging`
  }
);

export const fetchStartAtom = createAtom({}, ($, state = NaN) => {
  $(imagesAtom, (newState, oldState) => {
    if (newState.isLoading && !oldState?.isLoading) {
      state = Date.now();
    }
  });
  return state;
});

export const fetchEndAtom = createAtom({}, ($, state = NaN) => {
  $(imagesAtom, (newState, oldState) => {
    if (!newState.isLoading && oldState?.isLoading) {
      state = Date.now();
    }
  });
  return state;
});

export const lastRequestTimeAtom = createAtom({}, ($, state = NaN) => {
  const start = $(fetchStartAtom);
  $(fetchEndAtom, (end) => (state = end - start));
  return state;
});
