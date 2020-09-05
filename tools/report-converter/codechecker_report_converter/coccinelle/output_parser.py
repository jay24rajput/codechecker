# -------------------------------------------------------------------------
#
#  Part of the CodeChecker project, under the Apache License v2.0 with
#  LLVM Exceptions. See LICENSE for license information.
#  SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception
#
# -------------------------------------------------------------------------

import logging
import os
import re

from ..output_parser import BaseParser, Message
LOG = logging.getLogger('ReportConverter')


class CoccinelleParser(BaseParser):
    """
    Parser for Coccinelle Output
    """

    def __init__(self, analyzer_result):
        super(CoccinelleParser, self).__init__()

        self.analyzer_result = analyzer_result

        self.message_line_re = re.compile(
            # File path followed by a ':'.
            r'^(?P<path>[\S ]+?):'
            # Line number followed by a ':'.
            r'(?P<line>\d+?):'
            # r'(?P<column>(\d+?)-(\d+?):)'
            # r'(?P<bug>[\S ]+?:)'
            # Message.
            r'(?P<message>[\S \t]+)\s*')

    def parse_message(self, it, line):
        """
        Actual Parsing function for the given line
        """
        match = self.message_line_re.match(line)
        if match is None:
            return None, next(it)

        file_path = os.path.join(os.path.dirname(self.analyzer_result),
                                 match.group('path'))
        column = 0
        checker_name = None

        message = Message(
            file_path,
            int(match.group('line')),
            column,
            match.group('message').strip(),
            checker_name)

        try:
            return message, next(it)
        except StopIteration:
            return message, ''
