function transpile(query) {
	// Rules definitons
	// set is a word
	// cols is a list of words separated by commas
	// rows is a list of two numbers
	// conditions is a list of sql where clauses separated by semi-colons
  const rules = [
    {
      case: "[set][cols][rows][conditions]",
      regex:
				/^(?<set>\w+)\s+\[(?<cols>[\w,\s]+)\]\s+\[(?<rows>[\d,\s]+)\]\s+\{(?<conditions>[\w\s\(\)\=\<\>\!\,\;\.\']+)\}$/,
    },
    {
      case: "[set][cols][rows]",
      regex:
				/^(?<set>\w+)\s+\[(?<cols>[\w,\s]+)\]\s+\[(?<rows>[\d,\s]+)\]$/,
    },
    {
      case: "[set][cols][conditions]",
      regex:
				/^(?<set>\w+)\s+\[(?<cols>[\w,\s]+)\]\s+\{(?<conditions>[\w\s\(\)\=\<\>\!\,\;\.\']+)\}$/,
    },
    {
      case: "[set][rows][conditions]",
      regex:
				/^(?<set>\w+)\s+\[(?<rows>[\d,\s]+)\]\s+\{(?<conditions>[\w\s\(\)\=\<\>\!\,\;\.\']+)\}$/,
    },
    {
      case: "[set][rows]",
      regex:
				/^(?<set>\w+)\s+\[(?<rows>[\d,\s]+)\]$/,
    },
    {
      case: "[set][cols]",
			regex: /^(?<set>\w+)\s+\[(?<cols>[\w,\s]+)\]$/,
    },
    {
      case: "[set][conditions]",
			regex: /^(?<set>\w+)\s+\{(?<conditions>[\w\s\(\)\=\<\>\!\,\;\.\']+)\}$/,
    },
    {
      case: "[set]",
			regex: /^(?<set>\w+)$/,
    },
  ];

  for (let rule of rules) {
    const matches = query.match(rule.regex);
    if (matches) {
			return(groupsToSQL(matches.groups));
    }
  }
}

function groupsToSQL(groups) {
	const cols = `SELECT ${groups.cols ? groups.cols : "*"}\n`;
	const from = `FROM ${groups.set}\n`;
	const where = groups.conditions ? `WHERE ${groups.conditions.replace(/\s*;\s*/, "\nAND ")}\n` : "";
	const limit = groups.rows ? `LIMIT ${groups.rows}\n` : "";
	return cols+from+where+limit;
}

transpile("A [name]");
transpile("A [name, age]");
transpile("A [name, age] {age > 25}");
transpile("A [100] {age > 25}");
transpile("A [name, age] [100]");
transpile("A")
transpile("People [name, email, jobs] [100, 100]");
console.log(transpile("People [name, email, jobs] [100, 200] {age > 25; city = 'London'}"));
console.log(transpile("Users [name, email, jobs] [100, 200] {age > 25; city = 'London'}"));