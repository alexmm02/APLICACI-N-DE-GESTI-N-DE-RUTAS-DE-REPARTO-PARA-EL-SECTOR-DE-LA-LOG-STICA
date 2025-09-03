import { forwardRef } from "react";

export const Input = forwardRef((props, ref) => {
  return (
    <input
      type="text"
      ref={ref}
      className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-md w-full my-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      {...props}
    />
  );
});

export default Input;
