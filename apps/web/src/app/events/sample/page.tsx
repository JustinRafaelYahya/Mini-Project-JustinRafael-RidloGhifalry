import MainButton from '@/components/MainButton';
import MainLink from '@/components/LinkMain';
import React from 'react';

const page = () => {
  return (
    <section className="grid lg:grid-cols-2  p-4 mt-24 mx-auto max-w-[1350px] h-screen">
      <div className="mt-12"> </div>
      <div className="mx-6 max-w-xl lg:pl-20">
        <div className="mx-auto">
          {/* <Link href="/products/"> */}
          <MainLink className="float-left">⪡ Back to Events page</MainLink>
          {/* </Link> */}
        </div>
        <h3 className="text-4xl font-bold mt-10">Event Title</h3>
        {/* {title} */}
        <p className="mt-2 font-semibold mb-8">Rp. 200.000</p>
        {/* $ {price} */}
        <div className="rich-text ">
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Soluta
            saepe similique eligendi, consectetur doloribus dolores eos
            recusandae! Doloribus totam, voluptatem voluptas ducimus velit ea
            nostrum laborum voluptatibus accusamus expedita labore. Ea, quas
            ipsum. Quasi excepturi quidem fugiat eos voluptatem ducimus labore
            eius laboriosam sed voluptatum maxime quae corrupti, nesciunt rerum
            quos quam error. Consectetur tempore, nihil eaque voluptatem
            accusantium exercitationem.
          </p>
          {/* {documentToReactComponents(description)} */}
        </div>
        <p className="mt-4 mb-[-1rem] text-lg font-semibold">Spesifications:</p>
        {/* <ul className="p-5 flex flex-col list-disc ">
          {spesifications.map((spec, index) => (
            <li key={index} className="list-disc my-1">
              {spec}
            </li>
          ))}
        </ul> */}
        <MainButton className="lg:mt-10 w-full">Purchase</MainButton>
      </div>
    </section>
  );
};

export default page;
