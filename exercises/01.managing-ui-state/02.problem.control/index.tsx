import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { generateGradient, getMatchingPosts } from '#shared/blog-posts'

function App() {
	const [query, setQuery] = useState('')

	// 🐨 make a function called handleCheck that accepts a "tag" string and a "checked" boolean
	// 🐨 By calling setQuery, add the tag to the query if checked and remove it if not
	const handleCheck = (tag: string, checked: boolean) => {
		if (checked) {
			setQuery(currentQuery => {
				return currentQuery ? currentQuery + ' ' + tag : tag
			})
		} else {
			setQuery(currentQuery => {
				const queries = currentQuery.split(' ')
				const indexToRemove = queries.findIndex(item => item === tag)
				if (indexToRemove > -1) {
					// only splice array when item is found
					queries.splice(indexToRemove, 1) // 2nd parameter means remove one item only
				}
				return queries.join(' ')
			})
		}
	}

	return (
		<div className="app">
			<form>
				<div>
					<label htmlFor="searchInput">Search:</label>
					<input
						id="searchInput"
						name="query"
						type="search"
						// 🐨 set the value prop to query
						value={query}
						onChange={e => setQuery(e.currentTarget.value)}
					/>
				</div>
				<div>
					<label>
						<input
							type="checkbox"
							// 🐨 add an onChange to call handleCheck with dog and event.currentTarget.checked
							onChange={event => {
								handleCheck('dog', event.currentTarget.checked)
							}}
						/>{' '}
						🐶 dog
					</label>
					<label>
						<input
							type="checkbox"
							// 🐨 add an onChange to call handleCheck with cat and event.currentTarget.checked
							onChange={event => {
								handleCheck('cat', event.currentTarget.checked)
							}}
						/>{' '}
						🐱 cat
					</label>
					<label>
						<input
							type="checkbox"
							// 🐨 add an onChange to call handleCheck with caterpillar and event.currentTarget.checked
							onChange={event => {
								handleCheck('caterpillar', event.currentTarget.checked)
							}}
						/>{' '}
						🐛 caterpillar
					</label>
				</div>
				<button type="submit">Submit</button>
			</form>
			<MatchingPosts query={query} />
		</div>
	)
}

function MatchingPosts({ query }: { query: string }) {
	const matchingPosts = getMatchingPosts(query)

	return (
		<ul className="post-list">
			{matchingPosts.map(post => (
				<li key={post.id}>
					<div
						className="post-image"
						style={{ background: generateGradient(post.id) }}
					/>
					<a
						href={post.id}
						onClick={event => {
							event.preventDefault()
							alert(`Great! Let's go to ${post.id}!`)
						}}
					>
						<h2>{post.title}</h2>
						<p>{post.description}</p>
					</a>
				</li>
			))}
		</ul>
	)
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
createRoot(rootEl).render(<App />)
