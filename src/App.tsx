import React from 'react';

type Props = {
  message: string;
};

const App: React.FC<Props> = ({ message }) => {
  return <h1 className="text-2xl font-bold text-blue-500">{message}</h1>;
};

export default App;