// import { useEffect, useState } from "react";

// export const useOrigin = () => {
//   const [mounted, setMounted] = useState(false);
//   const [origin, setOrigin] = useState("");

//   useEffect(() => {
//     setMounted(true);
//     if (typeof window !== "undefined" && window.location.origin) {
//       setOrigin(window.location.origin);
//     }
//   }, []);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) {
//     return "";
//   }

//   return origin;
// };

import { useEffect, useState } from "react";

export const useOrigin = () => {
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    // This effect runs only on the client after mounting.
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  return origin;
};

