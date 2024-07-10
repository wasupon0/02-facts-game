export default function getCategoryName(categoryId) {
  let categoryName;
  switch (categoryId) {
    case "9":
      categoryName = "General Knowledge";
      break;
    case "10":
      categoryName = "Entertainment: Books";
      break;
    case "11":
      categoryName = "Entertainment: Film";
      break;
    case "12":
      categoryName = "Entertainment: Music";
      break;
    case "13":
      categoryName = "Entertainment: Musicals & Theatres";
      break;
    case "14":
      categoryName = "Entertainment: Television";
      break;
    case "15":
      categoryName = "Entertainment: Video Games";
      break;
    case "16":
      categoryName = "Entertainment: Board Games";
      break;
    case "17":
      categoryName = "Science & Nature";
      break;
    case "18":
      categoryName = "Science: Computers";
      break;
    case "19":
      categoryName = "Science: Mathematics";
      break;
    case "20":
      categoryName = "Mythology";
      break;
    case "21":
      categoryName = "Sports";
      break;
    case "22":
      categoryName = "Geography";
      break;
    case "23":
      categoryName = "History";
      break;
    case "24":
      categoryName = "Politics";
      break;
    case "25":
      categoryName = "Art";
      break;
    case "26":
      categoryName = "Celebrities";
      break;
    case "27":
      categoryName = "Animals";
      break;
    case "28":
      categoryName = "Vehicles";
      break;
    case "29":
      categoryName = "Entertainment: Comics";
      break;
    case "30":
      categoryName = "Science: Gadgets";
      break;
    case "31":
      categoryName = "Entertainment: Japanese Anime & Manga";
      break;
    case "32":
      categoryName = "Entertainment: Cartoon & Animations";
      break;
    default:
      categoryName = "Unknown Category";
      break;
  }
  return categoryName;
}
