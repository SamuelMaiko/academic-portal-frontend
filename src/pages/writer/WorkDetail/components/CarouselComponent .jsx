import React from "react";
import classNames from "embla-carousel-class-names";
import {
  Carousel,
  CarouselButtons,
  CarouselControl,
  CarouselIndicators,
  CarouselItem,
  CarouselNextButton,
  CarouselPrevButton,
  CarouselSlides,
} from "keep-react";

const CarouselComponent = ({ images }) => {
  return (
    <Carousel options={{ loop: true }}>
      <CarouselSlides>
        {images &&
          images.map((image, index) => (
            <CarouselItem key={index} className="pl-0 md:h-[100vh] h-[43vh]">
              <img className="h-full" src={image.image} alt="Carousel Item" />
            </CarouselItem>
          ))}
      </CarouselSlides>
      <CarouselControl>
        <div
          className={`absolute top-1/2 -translate-y-1/2 -left-[27%] ${
            images.length === 1 ? "hidden" : ""
          }`}
        >
          <CarouselPrevButton className="" />
        </div>
        <div
          className={`absolute top-1/2 -translate-y-1/2 -right-[27%] ${
            images.length === 1 ? "hidden" : ""
          }`}
        >
          <CarouselNextButton />
        </div>
        {/* <CarouselIndicators className="absolute left-1/2 -translate-x-1/2 z-50 bottom-[5%]" /> */}
      </CarouselControl>
    </Carousel>
  );
};

export default CarouselComponent;
