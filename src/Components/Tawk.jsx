import { useEffect } from "react";

const Tawk = () => {
    useEffect(() => {
        var Tawk_API = Tawk_API || {};
        var Tawk_LoadStart = new Date();
        (function () {
            var s1 = document.createElement("script");
            var s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = import.meta.env.VITE_TAWK_CODE;
            s1.charset = "UTF-8";
            s1.setAttribute("crossorigin", "*");
            s0.parentNode.insertBefore(s1, s0);
        })();
    }, []);

    return null;
};

export default Tawk;