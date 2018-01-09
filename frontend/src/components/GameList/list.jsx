import _ from 'lodash';
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';

import "./list.css";

import { load as loadGames, loadWatched as loadWatchedGames, addWatched as addWatchedGame, removeWatched as removeWatchedGame } from './redux';

class List extends React.Component {
    componentDidMount() {
        this.props.dispatch(loadGames());
        this.props.dispatch(loadWatchedGames());
    }

    isFollowingGame(game) {
        return _.includes(this.props.watchedGames, game.id);
    }

    toggleWatchedGame(game) {
        if (this.isFollowingGame(game)) {
            this.props.dispatch(removeWatchedGame(game));
        } else {
            this.props.dispatch(addWatchedGame(game));
        }
    }

    render() {
        return (
            <Table hover>
                <thead>
                    <tr>
                        <th></th>
                        <th>Title</th>
                        <th>Runners</th>
                        <th>Start Time</th>
                    </tr>
                </thead>
                <tbody>
                {
                    this.props.games.map(game => {
                        return (
                            <tr key={game.id} onDoubleClick={() => this.toggleWatchedGame(game)}>
                                <td onClick={() => this.toggleWatchedGame(game)}>
                                    {
                                        this.isFollowingGame(game) ? (
                                            <i className="fa fa-heart favorite" />
                                        ) : (
                                            <i className="fa fa-heart-o favorite" />
                                        )
                                    }
                                </td>
                                <td>{game.title}</td>
                                <td>{game.runners}</td>
                                <td>{moment(game.startTime).format('YYYY-MM-DD, hh:mm a')}</td>
                            </tr>
                        );
                    })
                }
                </tbody>
            </Table>
        );
    }
};

const mapStateToProps = state => {
    return {
        games: state.GameList.games,
        watchedGames: state.GameList.watchedGames,
    };
};

export default connect(mapStateToProps)(List);