import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
	calculateNextValue,
	calculateStatus,
	calculateWinner,
	// 💰 these could be handy
	isValidGameState,
	type GameState,
	type Squares,
} from '#shared/tic-tac-toe-utils'

function Board({
	squares,
	onClick,
}: {
	squares: Squares
	onClick: (index: number) => void
}) {
	function renderSquare(i: number) {
		const value = squares[i]
		const label = value ? `square ${i}, ${value}` : `square ${i} empty`

		return (
			<button className="square" onClick={() => onClick(i)} aria-label={label}>
				{squares[i]}
			</button>
		)
	}

	return (
		<div>
			<div className="board-row">
				{renderSquare(0)}
				{renderSquare(1)}
				{renderSquare(2)}
			</div>
			<div className="board-row">
				{renderSquare(3)}
				{renderSquare(4)}
				{renderSquare(5)}
			</div>
			<div className="board-row">
				{renderSquare(6)}
				{renderSquare(7)}
				{renderSquare(8)}
			</div>
		</div>
	)
}

// 🐨 our new default state will be a GameState object
const defaultState = {
	history: [Array(9).fill(null)],
	currentStep: 0,
}

// 🐨 probably makes sense to change the name of the localStorageKey to 'tic-tac-toe'
const localStorageKey = 'tic-tac-toe'
function App() {
	// 🐨 You can now call this simply "state" and "setState" and it's now GameState instead of Squares
	const [state, setState] = useState<GameState>(() => {
		let localStorageValue
		try {
			localStorageValue = JSON.parse(
				window.localStorage.getItem(localStorageKey) ?? 'null',
			)
		} catch {
			// something is wrong in localStorage, so don't use it
			return defaultState
		}

		// 🐨 you now need to make sure it's a valid game state object.
		// 💰 isValidGameState(localStorageValue) will do that for you
		return isValidGameState(localStorageValue)
			? localStorageValue
			: defaultState
	})

	// 🐨 get the "currentSquares" from state.history[state.currentStep]

	// 🐨 any reference to "squares" below should be changed to "currentSquares"
	const winner = calculateWinner(state.history[state.currentStep])
	const nextValue = calculateNextValue(state.history[state.currentStep])
	const status = calculateStatus(
		winner,
		state.history[state.currentStep],
		nextValue,
	)

	useEffect(() => {
		// 🐨 we should serialize the entire state here instead of just the squares
		window.localStorage.setItem(localStorageKey, JSON.stringify(state))
		// 🐨 update the dependency array to be state instead of squares
	}, [state])

	function selectSquare(index: number) {
		if (winner || state.history[state.currentStep][index]) return
		// 🐨 this is now setState and previousState, not setSquares and previousSquares
		setState(previousState => {
			// 🐨 create an updated history and squares object
			// 💰 note that the history should be from index 0 to the current step plus the new squares
			// and the new current step should be equal to the last index of the new history
			const { currentStep, history } = previousState
			const newHistory = history.slice(0, currentStep + 1)
			const squares = history[currentStep].with(index, nextValue)

			return {
				history: [...newHistory, squares],
				currentStep: newHistory.length,
			}
		})
	}

	function restart() {
		// 🐨 this is now setState
		setState(defaultState)
	}

	// 🐨 create moves by mapping over the history and rendering on <li> for each
	// step in the history. This should have a button which when clicked calls
	// `setState` to update the currentStep.
	// 💯 disable the current step
	// 💰 NOTE: the "step" is actually the "index" which normally you don't want to
	// use as the "key" prop. However, in this case, the index is effectively
	// the "id" of the step in history, so it is correct.
	const moves = state.history.map((_stepSquares, step) => {
		const desc = step ? `Go to move number ${step}` : 'Go to game start'
		const isCurrentStep = step === state.currentStep
		return (
			<li key={step}>
				<button
					onClick={() =>
						setState(previousState => ({ ...previousState, currentStep: step }))
					}
					disabled={isCurrentStep}
				>
					{desc} {isCurrentStep ? '(current)' : null}
				</button>
			</li>
		)
	})

	return (
		<div className="game">
			<div className="game-board">
				{/* 🐨 update the reference of "squares" here to "currentSquares" */}
				<Board
					onClick={selectSquare}
					squares={state.history[state.currentStep]}
				/>
				<button className="restart" onClick={restart}>
					restart
				</button>
			</div>
			<div className="game-info">
				<div aria-live="polite">{status}</div>
				<ol>{moves}</ol>
			</div>
		</div>
	)
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
createRoot(rootEl).render(<App />)
