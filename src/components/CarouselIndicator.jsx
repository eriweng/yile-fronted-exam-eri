

export default function CarouselIndicator({ active }) {
  return (
    <div
      className={`h-[6px] rounded-[18px] transition-all duration-300 ${
        active ? 'w-[24px] bg-orange-700' : 'w-[6px] bg-gray-500'
      }`}
    />
  );
}
