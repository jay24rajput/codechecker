`report-converter` tools are used to analyze the kernel. Some of the supported parsers are as follows:

## Table of Contents

* [Coccinelle](#coccinelle)

## [Coccinelle](https://github.com/coccinelle/coccinelle)
[Coccinelle](https://github.com/coccinelle/coccinelle) allows programmers to easily 
write some complex style-preserving source-to-source transformations on C source code, 
like for instance to perform some refactorings.

The recommended way of running Coccinelle is to redirect the output to a file and
give this file to the report converter tool.

The following example shows you how to run Coccinelle and store the results
found by Coccinelle to the CodeChecker database.
```sh
# Change Directory to your project
cd path/to/your/project

# Run Coccicheck 
make coccicheck MODE=report V=1 > ./coccinelle_reports.out

# Use 'report-converter' to create a CodeChecker report directory from the
# analyzer result of Coccicheck
report-converter -t coccinelle -o ./codechecker_coccinelle_reports ./coccinelle_reports.out

# Store the Cocccinelle reports with CodeChecker.
CodeChecker store ./codechecker_coccinelle_reports -n coccinelle

```