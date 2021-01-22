import React from "react";
import { game } from "../main";
import { observer } from "mobx-react";
import { Table } from 'antd'

function ScoreBoard() {
    const columns=[
        {
            title: 'Round #',
            dataIndex: 'roundNumber',
            key: 'round',
            align: 'center',
        },
        {
            title: 'Player 1',
            dataIndex: 'p1Score',
            key: 'p1Score',
            align: 'center',
        },
        {
            title: 'Player 2',
            dataIndex: 'p2Score',
            key: 'p2Score',
            align: 'center',
        },
    ]



  return (
    <div className="scoreboard-container">
        <h1 className="scoreboard-header">Scoreboard</h1>
        <Table columns={columns} dataSource={game.score} pagination={false} scroll={{ x: 'max-content' }} align={"center"} key={`${game.score[game.roundNumber-1].key}`}/> 
    </div>
  );
}

export default observer(ScoreBoard);
