import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

function PizzaCarousel() {
  const { data: pizzas, isLoading, isError, error } = useQuery({
    queryKey: ['pizzas'],
    queryFn: async () => {
      const { data } = await axios.get('/api/pizzas');
      return data.reverse();
    },
  });

  // TODO: add loading skeleton and better error display
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="flex my-4 w-full justify-center items-center py-4">
      <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-xlg text-black w-[700px]"
    >
      <CarouselContent>
        {pizzas.map((pizza, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
              <CardContent className="relative flex flex-col aspect-square items-center justify-center p-0 overflow-hidden rounded-lg">
                <div 
                  className="absolute w-full h-full bg-contain bg-center rounded-lg"
                  style={{
                    backgroundImage: "url(https://plus.unsplash.com/premium_photo-1668771085743-1d2d19818140?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)"
                  }}
                />
                <div className="z-10 flex flex-col items-center text-white bg-orange-900 bg-opacity-70 p-4 rounded-lg">
                  <span className="font-semibold">{pizza.name}</span>
                  <p className="mt-4">Last Ordered</p>
                  <span className="font-semibold">
                    {new Date(pizza.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </div>
  )
}

export default PizzaCarousel;
