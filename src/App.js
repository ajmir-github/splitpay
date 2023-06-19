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
  const [input, setInput] = useState();
  function nextPage() {
    if (!input) return;
    setStore({ total: +input, remaining: +input, paid: 0 });
    navigate("/split");
  }
  return (
    <div className="flex flex-col gap-4 sm:gap-8 grow">
      <div className="grow text-4xl sm:text-6xl">Enter the total:</div>
      <input
        id="totalInput"
        type="number"
        className="input input-bordered input-primary grow text-xl text-center"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={nextPage} className="btn btn-primary text-xl">
        Split
      </button>
    </div>
  );
}

function Indicator({ store }) {
  return (
    <div className="stats stats-horizontal">
      <div className="stat">
        <div className="stat-title">Total</div>
        <div className="stat-value">€{store.total}</div>
      </div>

      <div className="stat">
        <div className="stat-title">Remaining</div>
        <div className="stat-value">€{store.remaining}</div>
      </div>

      <div className="stat">
        <div className="stat-title">Paid</div>
        <div className="stat-value">€{store.paid}</div>
      </div>
    </div>
  );
}

function PayFor({ setStore }) {
  const [input, setInput] = useState("");
  const [list, setList] = useState([]);
  const [subtotal, setSubTotal] = useState(0);
  const addToList = () => {
    if (!input) return;
    setList([...list, +input]);
    setInput("");
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
    <div className="flex flex-col gap-4 sm:gap-8">
      {list.length > 0 && (
        <table className="table table-zebra table-lg">
          {/* head */}
          <thead>
            <tr>
              <th>#Items</th>
              <th>Prices</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((price, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>€{price}</td>
                <td>
                  <button
                    className="btn btn-circle btn-outline btn-sm btn-error"
                    onClick={() => removeFromList(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="join">
        <input
          className="input input-bordered input-primary join-item grow text-center text-lg"
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="btn join-item btn-primary text-lg"
          onClick={addToList}
        >
          Add
        </button>
      </div>
      {!subtotal || (
        <button className="btn btn-success text-lg" onClick={pay}>
          Pay €{subtotal}
        </button>
      )}
    </div>
  );
}

function Split({ store, setStore }) {
  return (
    <div className="flex flex-col gap-4 sm:gap-8 grow">
      <Link to={"/"} className="btn grow btn-error">
        Clear
      </Link>
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
    <div className="flex justify-center p-4 sm:p-8">
      <div className="max-w-screen-sm grow">
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
    </div>
  );
}

export default App;
