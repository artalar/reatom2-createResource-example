import { useAtom } from "@reatom/react";

import { imagesAtom, pageAtom, lastRequestTimeAtom } from "./model";
import { Lens } from "./Lens";

export default function App() {
  const [{ data, isLoading }] = useAtom(imagesAtom);
  const [page, { next, prev }] = useAtom(pageAtom);
  const [lastRequestTime] = useAtom(lastRequestTimeAtom);

  return (
    <div>
      <h1>artic.edu</h1>
      <button onClick={prev}>prev</button>
      <span> page: {page} </span>
      <button onClick={next}>next</button>
      <span>{isLoading && ` (Loading)`}</span>
      <p>
        <small>Loaded by {lastRequestTime}ms</small>
      </p>
      <ul>
        {data.map(({ image_id, title }) => (
          <Lens
            key={image_id}
            src={`https://www.artic.edu/iiif/2/${image_id}/full/843,/0/default.jpg`}
            alt={title}
            width={"20rem"}
            height={"20rem"}
          />
        ))}
      </ul>
    </div>
  );
}
