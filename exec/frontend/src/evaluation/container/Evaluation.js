import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import MovieItem from "../component/MovieItem";
import GridListTile from "@material-ui/core/GridListTile";
import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { actions } from "../state";
import { useSelector, useDispatch } from "react-redux";
import { callApiEvaluation } from "../../common/api";
import { homeActions } from "../../home/state";
import "./Evaluation.scss";

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    marginTop: "8px",
    border: "1px solid white",
    height: 7,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: "rgb(20, 21, 23)",
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "white",
  },
}))(LinearProgress);

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "0 50px 50px 50px",
    paddingTop: "130px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: "rgb(20, 21, 23)",
  },
  progressBox: {
    position: "fixed",
    textAlign: "center",
    paddingTop: "20px",
    zIndex: 100,
    height: "100px",
    width: "100%",
    background:
      "linear-gradient(to top, rgba(18, 18, 18, 0), rgba(18, 18, 18, 0.6) 10%, rgba(18, 18, 18, 0.8) 16%, rgb(18, 18, 18) 29%);",
  },
  progressBar: {
    position: "absolute",
    left: "30%",
    width: "40%",
    justifyContent: "center",
    textAlign: "center",
  },
  gridList: {
    height: "100%",
  },
  GridListTileBar: {
    height: "40%",
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  menu: {
    padding: theme.spacing(0, 2),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
}));

let pageNum = 1;
let loadingPage = false;
export default function Evaluation() {
  const classes = useStyles();
  const [pickNum, setPickNum] = useState(null);
  const [colsNum, setColsNum] = useState(5);
  const [text, setText] = useState("");
  const movieLists = useSelector((state) => state.evaluation.movieLists);
  const isLoading = useSelector((state) => state.evaluation.isLoading);
  const isInfinite = useSelector((state) => state.evaluation.isInfinite);
  const user = useSelector((state) => state.user.userData.member);
  const token = useSelector((state) => state.user.userData.token);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      const tmp = await callApiEvaluation(user.seq);
      setPickNum(tmp);
    }
    fetchData();
    function checkWindowInner() {
      const windowInnerWidth = window.innerWidth;
      if (windowInnerWidth < 600) {
        setColsNum(2);
      } else if (windowInnerWidth < 960) {
        setColsNum(3);
      } else if (windowInnerWidth < 1280) {
        setColsNum(4);
      } else {
        setColsNum(5);
      }
    }

    function handleScroll() {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      if (scrollTop + clientHeight + 1 >= scrollHeight) {
        // ????????? ?????? ???????????? ?????? ???????????? ????????????
        dispatch(actions.requestAddMovieList(pageNum, user.seq));
        if (!loadingPage) {
          pageNum += 1;
        }
        loadingPage = true;
      }
    }

    pageNum = 1;
    checkWindowInner();
    dispatch(actions.requestMovieList(0, user.seq));
    window.addEventListener("resize", function () {
      checkWindowInner();
    });
    window.addEventListener("scroll", handleScroll);
    dispatch(homeActions.setMovieList([]));
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", function () {
        checkWindowInner();
      });
    };
  }, [dispatch]);

  useEffect(() => {
    loadingPage = false;
  }, [movieLists]);

  useEffect(() => {
    if (pickNum < 2) {
      setText("?????? 10??? ????????? ????????? ?????????????????? :)");
    } else if (pickNum < 4) {
      setText("????????? ????????? ????????? ???????????? ????????????.");
    } else if (pickNum < 7) {
      setText("????????? ?????? ?????? ?????? ???????????? ?????????????");
    } else if (pickNum < 10) {
      setText("?????????. ?????? ????????? ????????? ????????? ???????????????.");
    } else if (pickNum < 11) {
      setText(
        "10??? ??????! ????????? ???????????? ?????? ??? ??????????????????. ????????? ?????? ???????????????."
      );
    } else if (pickNum < 15) {
      setText("??? ???????????? ?????? ???????????????! ????????? :)");
    } else if (pickNum < 20) {
      setText("?????? ????????? ??????????????? ????????? ?????? ??????.");
    } else if (pickNum < 25) {
      setText("??????, ?????? ?????????????????????!");
    } else if (pickNum < 30) {
      setText("30??? ????????? ??? ????????????!");
    } else if (pickNum < 35) {
      setText("??????! ?????? ???????????????????");
    } else if (pickNum < 40) {
      setText("?????? ?????? ????????? ?????? ???????????????.");
    } else if (pickNum < 50) {
      setText("?????? ????????? ??? ??? 50??? ?????????!.");
    } else if (pickNum < 60) {
      setText("????????????! ??? ????????? ?????? ?????? ????????????!");
    } else if (pickNum < 70) {
      setText("????????? ?????? ????????? ??????????????? ???????????????. ???, ????????????!");
    } else if (pickNum < 85) {
      setText("?????? ????????? ???????????? ?????? ???????????? ????????? ??? ??? ??????????");
    } else if (pickNum < 100) {
      setText("?????? ?????? ?????? ?????? ???????????? ??????????????");
    } else if (pickNum >= 100) {
      setText("100?????????! ????????? ????????? ????????? ????????????.");
    }
  }, [pickNum]);

  return (
    <div>
      <div className={classes.progressBox}>
        <Typography className={classes.menu} variant="h5">
          {pickNum}
        </Typography>
        <Typography
          className={classes.menu}
          variant="subtitle2"
          style={{ color: "gray", fontWeight: "bold" }}
        >
          {text}
        </Typography>
        <div className={classes.progressBar}>
          <BorderLinearProgress
            variant="determinate"
            value={(pickNum % 40) * 2.5}
          />
        </div>
        <div className="eval__button">
          <a
            style={{ color: "black" }}
            href={`https://netcha-pedia.netlify.app/user/statics/${user.seq}/${token}`}
            target="blank"
          >
            NETCHA PEDIA?????? ??? ???????????? ?????? ??????
          </a>
        </div>
      </div>
      <div className="eval__root">
        {!isLoading && (
          <GridList
            cellHeight={"auto"}
            className={classes.gridList}
            cols={colsNum}
            spacing={35}
          >
            {movieLists.map((tile, idx) => (
              <GridListTile key={idx}>
                <MovieItem
                  tile={tile}
                  pickNum={pickNum}
                  setPickNum={setPickNum}
                  idx={idx}
                />
              </GridListTile>
            ))}
          </GridList>
        )}
        {isLoading && (
          <div
            style={{ height: "60vh", display: "flex", alignItems: "center" }}
          >
            <CircularProgress color="secondary" />
          </div>
        )}
      </div>
      {isInfinite && !isLoading && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress color="secondary" />
        </div>
      )}
    </div>
  );
}
