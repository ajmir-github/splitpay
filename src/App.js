import { useEffect, useRef, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

function normalizeFloat(strNum) {
  return parseFloat(parseFloat(strNum).toFixed(2));
}

function CurrencyInput({ onNext, children }) {
  const inputRef = useRef(null);
  const onClick = () => {
    const input = inputRef.current.value;
    const number = normalizeFloat(input);
    onNext(number);
  };
  return (
    <div className="join">
      <input
        className="input input-bordered input-primary join-item grow text-center text-lg"
        type="number"
        ref={inputRef}
      />
      <button className="btn join-item btn-primary text-lg" onClick={onClick}>
        {children}
      </button>
    </div>
  );
}

function Home({ setStore }) {
  const navigate = useNavigate();
  function nextPage(input) {
    setStore({ total: input, remaining: input, paid: 0 });
    navigate("/split");
  }
  return (
    <div className="flex flex-col gap-4 sm:gap-8 grow">
      <div className="grow text-4xl sm:text-6xl">Enter the total:</div>
      <CurrencyInput onNext={nextPage}>Split</CurrencyInput>
    </div>
  );
}

function Stats({ store }) {
  return (
    <div className="stats stats-horizontal">
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
  const [list, setList] = useState([]);
  const [subtotal, setSubTotal] = useState(0);
  const addToList = (num) => {
    setList([...list, num]);
  };
  const removeFromList = (targetIndex) => {
    setList(list.filter((_, index) => index !== targetIndex));
  };
  useEffect(() => {
    if (list.length === 0) return;
    const totalNum = list.reduce((a, b) => a + b);
    const normalNum = parseFloat(totalNum).toFixed(2);
    setSubTotal(normalNum);
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
      <CurrencyInput onNext={addToList}>Add</CurrencyInput>
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
      <div className="flex items-center">
        <div className="font-extrabold text-2xl text-center grow">
          Total €{store.total}
        </div>
        <Link to={"/"} className="btn  btn-error btn-outline btn-sm">
          Clear
        </Link>
      </div>
      <Stats store={store} />
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
