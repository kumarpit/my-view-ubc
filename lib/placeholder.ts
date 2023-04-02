import { getPlaiceholder } from "plaiceholder";

export const getStaticProps = async (url: string) => {
    const { base64, img } = await getPlaiceholder(
        url,
      { size: 10 }
    );
    return {
      props: {
        imageProps: {
          ...img,
          blurDataURL: base64,
        },
      },
    };
};