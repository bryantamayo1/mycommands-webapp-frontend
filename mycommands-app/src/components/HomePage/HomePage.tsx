import './HomePage.css';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useCallback, useEffect, useState } from 'react';
import { ServicesCategories } from '../../services/ServicesCategories';
import { InterfaceGetFilters } from '../../interfaces/Categories';
import { useCalculateWindow } from '../../hooks/useCalculateWindow';

type typePieChart = {
  name: string,
  value: number,
  color: string
}

type typeStateInitial = {
  categories: typePieChart[],
  resp: InterfaceGetFilters,
}

const StateInitial: typeStateInitial = {
  categories: [] as typePieChart[],
  resp: {} as InterfaceGetFilters,
}

export const HomePage = () => {
  ////////
  // Hooks
  ////////
  const [state, setState] = useState(StateInitial);
  const {innerWidth} = useCalculateWindow();


  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    const resp = await ServicesCategories.getCategories();
    const respOriginal = structuredClone(resp);
    resp.data.shift();
    const newResp = resp.data.map(item => {
      return {
        name: item.category,
        value: item.results,
        color: generateRandomColors()
      }
    });
    setState(prevState => ({ ...prevState, categories: newResp, resp: respOriginal }));
  }

   const generateRandomColors = () => {
    return "#" + Math.floor(Math.random()*16777215).toString(16);
  }

  return (
    <div className='mc-container-page'>
      <div className='mc-d-container-dashboard'>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={800} height={800}>
            <Pie
              dataKey="value"
              data={state.categories}
              cx="50%"
              cy="50%"
              outerRadius={innerWidth > 600? 200: 100}
              label
            >
              {state.categories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* List */}
      <table className='mc-h-table'>
        <tr className='mc-table--header'>
          <th>Category</th>
          <th>Quantity</th>
        </tr>
          
        <tr>
          <td>{state.resp.data?.length > 0 && state.resp.data[0].category}</td>
          <td style={{ textAlign: "end" }}>{state.resp.data?.length > 0 && state.resp.data[0].results}</td>
        </tr>
        {state.categories.map(item => (
          <tr>
            <td>{item.name}</td>
            <td style={{ textAlign: "end" }}>{item.value}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}
