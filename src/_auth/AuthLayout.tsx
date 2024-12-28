import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import React from "react";
import { Outlet } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";

const images = [
  "https://tse1.mm.bing.net/th?id=OIG1.HuNSSdmgWEZEZiMcMYL3&pid=ImgGn",
  "https://tse3.mm.bing.net/th?id=OIG1.Xat2yReV_Zjetnc60T1w&pid=ImgGn",
  "https://tse3.mm.bing.net/th?id=OIG2.d5ouC41RNfZdL6fTON9H&pid=ImgGn",
];

const AuthLayout = () => {
  const autoplay = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <>
      {/* <div className="bg-black hidden xl:block h-screen w-5/12 object-cover bg-no-repeat"> */}
      <Carousel
        plugins={[autoplay.current]}
        className="hidden xl:block h-screen w-6/12 object-cover bg-no-repeat"
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
      >
        <CarouselContent>
          {Array.from({ length: 3 }).map((_, index) => (
            <CarouselItem key={index}>
              <Card className="rounded-none w-full h-screen">
                <CardContent className="flex h-screen items-center justify-center p-0">
                  <img
                    src={images[index]}
                    alt="carousel"
                    className="h-full"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* </div> */}

      <section className="flex flex-1 justify-center items-center flex-col py-10">
        <Outlet />
      </section>

      {/* <img
            src=""
            alt="logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          /> */}
    </>
  );
};

export default AuthLayout;
