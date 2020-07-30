import {useState} from "react";
import Head from "next/head";
import axios from "axios";

const Page = () => {
	const [reverse, setReverse] = useState(false);
	const [answer, setAnswer] = useState();
	const [error, setError] = useState();
	const [form, setForm] = useState({
		name: "",
		tag: "",
		id: ""
	});

	const doTheThing = () => {
		if (answer) {
			setAnswer();
			setForm({
				name: "",
				tag: "",
				id: ""
			});
		} else {
			if (reverse) {
				if (form.id.length !== 36) return setError("ID must be 36 characters long")
			} else {
				const tag = form.tag.startsWith("#") ? form.tag.substr(1) : form.tag;
				if (tag.length !== 4) return setError("Tag must be 4 digits long");
			}

			setError();
			axios.get(
				`/api?${
					reverse ?
						`id=${encodeURIComponent(form.id)}` :
						`name=${encodeURIComponent(form.name)}&tag=${encodeURIComponent(tag)}`}`
			)
				.then(({data}) => setAnswer(data.text))
				.catch(() => setError("We couldn't find that user!"))
		}
	};

	return (
		<>
			<Head>
				<title>What is my ID?</title>
			</Head>

			<div className="container">
				<main>
					<h1>What is my {reverse ? "name and tag" : "ID"}?</h1>
					<p className="explain">Find the {reverse ? "name and tag" : "id"} of your Alles account from the {reverse ? "id" : "name and tag"}.</p>
					
					{answer ? (
						<div className="answer">
							{answer}
						</div>
					) : (
						<form className="inputs" onSubmit={e => {
							e.preventDefault();
							doTheThing();
						}}>
							{reverse ? (
								<input
									placeholder="00000000-0000-0000-0000-000000000000"
									key="id"
									onInput={e => {
										setError();
										setForm({...form, id: e.target.value});
									}}
								/>
							) : (
								<>
									<input
										placeholder="Archie Baer"
										key="name"
										onInput={e => {
											setError();
											setForm({...form, name: e.target.value});
										}}
									/>
									<input
										placeholder="#0001"
										key="tag"
										maxLength="5"
										onInput={e => {
											setError();
											setForm({...form, tag: e.target.value});
										}}
									/>
								</>
							)}
						</form>
					)}

					<div className="buttons">
						<button onClick={doTheThing}>{answer ? "Do it again" : "Do the thing"}</button>
						<button onClick={() => {
							setError();
							setAnswer();
							setForm({
								name: "",
								tag: "",
								id: ""
							});
							setReverse(!reverse)
						}}>Find my {reverse ? "ID" : "name and tag"}</button>
					</div>

					{error ? <p className="error">{error}</p> : <></>}
				</main>
			</div>

			<style jsx global>{`
				html,
				body,
				body > div:first-child,
				div#__next {
					height: 100%;
				}

				body {
					margin: 0 20px;
				}
			`}</style>

			<style jsx>{`
				* {
					font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
				}

				.container {
					display: flex;
					flex-flow: column;
					justify-content: center;
					height: 100%;
				}

				main {
					width: 400px;
					max-width: 100%;
					margin: 0 auto;
					text-align: center;
				}

				h1 {
					font-size: 50px;
					margin: 0;
				}

				p.explain {
					margin: 20px 0;
				}

				input, .answer, button {
					border: solid 1px;
					padding: 10px;
					width: 100%;
				}

				.inputs {
					display: flex;
				}

				input {
					min-width: 0;
					flex-shrink: 1;
					text-align: center;
					box-sizing: border-box;
					height: 40px;
				}

				input:nth-child(2) {
					margin-left: 10px;
				}

				.answer {
					box-sizing: border-box;
					height: 40px;
					font-style: italic;
				}

				.buttons {
					margin-top: 10px;
				}

				button {
					display: block;
					cursor: pointer;
					background: #f0f0f0;
				}

				button:hover {
					font-weight: bold;
				}

				button:nth-child(2) {
					border-top: none;
				}

				.error {
					font-style: italic;
					color: #ff0000;
				}
			`}</style>
		</>
	);
};

export default Page;