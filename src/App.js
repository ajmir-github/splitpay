import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

function Home({ setStore }) {
  const navigate = useNavigate();
  const [input, setInput] = useState(0);
  function nextPage() {
    if (!input) return;
    setStore({ total: +input, remaining: +input, paid: 0 });
    navigate("/split");
  }
  return (
    <div className="flex flex-col">
      <h1 className="4xl text-blue-600 font-serif">Enter the total:</h1>
      <input
        type="number"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={nextPage} className="">
        Split
      </button>
    </div>
  );
}

function Indicator({ store }) {
  return (
    <h1>
      <span className="text-red-700">Total:{store.total}</span>
      <span className="text-blue-700">Remaining:{store.remaining}</span>
      <span className="text-green-600">Paid:{store.paid}</span>
    </h1>
  );
}

function PayFor({ setStore }) {
  const [input, setInput] = useState(0);
  const [list, setList] = useState([]);
  const [subtotal, setSubTotal] = useState(0);
  const addToList = () => {
    if (!input) return;
    setList([...list, +input]);
    setInput(0);
  };
  const removeFromList = (targetIndex) => {
    setList(list.filter((_, index) => index !== targetIndex));
  };
  useEffect(() => {
    if (list.length > 0) setSubTotal(list.reduce((a, b) => a + b));
  }, [list]);

  const pay = () => {
    setStore((store) => ({
      ...store,
      paid: store.paid + subtotal,
      remaining: store.remaining - subtotal,
    }));
    setList([]);
    setSubTotal(0);
  };
  return (
    <div>
      <div>
        {list.map((item, index) => (
          <div key={index}>
            {index + 1}: {item}
            <button onClick={() => removeFromList(index)}>Delete</button>
          </div>
        ))}
      </div>
      <div>
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={addToList}>Add</button>
      </div>
      <div>
        <div>Subtotal: {subtotal}</div>
        <button onClick={pay}>Pay</button>
      </div>
    </div>
  );
}

function Split({ store, setStore }) {
  return (
    <div>
      <Link to={"/"}>Back</Link>
      <Indicator store={store} />
      <PayFor setStore={setStore} />
    </div>
  );
}

function App() {
  const [store, setStore] = useState({
    total: 10,
    remaining: 10,
    paid: 0,
  });

  useEffect(() => {
    console.log(store);
  });
  return (
    <div className="flex justify-center p-2">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Home store={store} setStore={setStore} />}
          />
          <Route
            path="/split"
            element={<Split store={store} setStore={setStore} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
