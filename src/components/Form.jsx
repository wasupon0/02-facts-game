function Form({ formData, handleFormChange }) {
  return (
    <form>
      <label htmlFor="trivia_category" className="form-label">
        Select Category
      </label>
      <br />
      <select
        value={formData.trivia_category}
        onChange={handleFormChange}
        name="trivia_category"
      >
        <option value="9">General Knowledge</option>
        <option value="10">Entertainment: Books</option>
        <option value="11">Entertainment: Film</option>
        <option value="12">Entertainment: Music</option>
        <option value="13">Entertainment: Musicals & Theatres</option>
        <option value="14">Entertainment: Television</option>
        <option value="15">Entertainment: Video Games</option>
        <option value="16">Entertainment: Board Games</option>
        <option value="17">Science & Nature</option>
        <option value="18">Science: Computers</option>
        <option value="19">Science: Mathematics</option>
        <option value="20">Mythology</option>
        <option value="21">Sports</option>
        <option value="22">Geography</option>
        <option value="23">History</option>
        <option value="24">Politics</option>
        <option value="25">Art</option>
        <option value="26">Celebrities</option>
        <option value="27">Animals</option>
        <option value="28">Vehicles</option>
        <option value="29">Entertainment: Comics</option>
        <option value="30">Science: Gadgets</option>
        <option value="31">Entertainment: Japanese Anime & Manga</option>
        <option value="32">Entertainment: Cartoon & Animations</option>
      </select>
      <br />
      <br />

      <label htmlFor="trivia_difficulty" className="form-label">
        Select Difficulty
      </label>
      <br />
      <select
        value={formData.trivia_difficulty}
        onChange={handleFormChange}
        name="trivia_difficulty"
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <br />
      <br />

      <label htmlFor="trivia_number_question" className="form-label">
        Number of Questions:
      </label>
      <br />
      <select
        value={formData.trivia_number_question}
        onChange={handleFormChange}
        name="trivia_number_question"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="40">40</option>
        <option value="50">50</option>
      </select>
    </form>
  );
}
export default Form;
