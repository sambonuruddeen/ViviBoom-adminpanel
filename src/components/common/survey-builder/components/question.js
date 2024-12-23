export default class Question {
    static TYPES = Object.freeze({
      SINGLE: "Single Response",
      MULTIPLE: "Multiple Response",
      TEXT: "Text Response"
    });
  
    static DEFAULTS = Object.freeze({
      text: "",
      type: Question.TYPES.SINGLE,
      options: []
    });
  
    constructor(params = {}) {
      const { text, type, options } = { ...Question.DEFAULTS, ...params };
      this.text = text;
      this.type = type;
      this.options = options;
    }
  
    get hasOptions() {
      return (
        this.type === Question.TYPES.SINGLE ||
        this.type === Question.TYPES.MULTIPLE
      );
    }
  
    get inputType() {
      if (this.type === Question.TYPES.SINGLE) return "radio";
      if (this.type === Question.TYPES.MULTIPLE) return "checkbox";
      throw new Error("This question does not have an input type.");
    }
  
    merge(patch) {
      return new Question({ ...this, ...patch });
    }
  }
  