import { useEffect, useState } from "react";
import loadMoreContent from "./loadMoreContent.js";

export default function LoadMoreContent() {
  // const [scrollY, setScrollY] = useState(0);
  // const [height,setHeight] = useState();

  useEffect(() => {
    if (
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 100
    ) {
      loadMoreContent();
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [window.scrollY, window.innerHeight]);

  return (
    <>
      <div>
        If I touch the edge of the document Scroll height, then it will initiate
        the loadMoreContent function.
      </div>
      <div>Loading</div>
    </>
  );
}
