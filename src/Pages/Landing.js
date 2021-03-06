import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router";
const spritePrefix = "https://img.pokemondb.net/sprites/home/normal";
const POKEMONS_PER_PAGE = 10;

function LandingPage() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const POKEMONS_PER_PAGE = 4;
  const spritePrefix = "https://img.pokemondb.net/sprites/home/normal/";
  const [input, setInput] = useState("");
  const [err, setErr] = useState(null);
  const imagePrefix =
    "https://assets.pokemon.com/assets/cms2/img/pokedex/full/";
  const history = useHistory();

  const fetchData = useCallback(() => {
    setLoading(true);
    setErr(null);
    const offset = (page - 1) * POKEMONS_PER_PAGE;
    fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${POKEMONS_PER_PAGE}&offset=${offset}`
    )
      .then((resp) => resp.json())
      .then((result) => {
        setData(result.results);
        setLoading(false);
      });
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = () => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${input}`)
      .then((resp) => resp.json())
      .then((json) => {
        setData([json]);
        setLoading(false);
      })
      .catch(() => {
        setErr(`${input} is not a pokemon`);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!input) {
      fetchData();
    }
  }, [input]);

  return (
    <div>
      <div className="form">
        <input
          type="search"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="container">
        {data
          ? data.map((v, i) => {
              return (
                <div
                  className="pokemon button"
                  onClick={() => history.push(`/pokemon/${v.name}`)}
                >
                  <p>{v.name}</p>
                  <img
                    src={`${spritePrefix}${v.name}.png`}
                    alt="bruh why no loading"
                  />
                </div>
              );
            })
          : null}
      </div>
      {err && <p className="error-message">{err}</p>}
      <div className="pagination">
        <button
          disabled={page === 1 || loading}
          className="button1"
          onClick={() => setPage(page === 1 ? 1 : page - 1)}
        >
          Previous
        </button>
        <button
          disabled={loading}
          classname="button2"
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
      <p className="page-number">Page {page}</p>
    </div>
  );
}
document.body.style = "background: aquamarine;";

export default LandingPage;
